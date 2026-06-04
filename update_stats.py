import requests
import re
import json
import os
import datetime
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

# Configurations
DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "data.js")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9"
}

def parse_abbreviated_number(num_str):
    """Converts strings like '20.5K' or '81.096' into integers."""
    # Clean string
    num_str = num_str.strip().lower()
    
    # Check for multiplier
    multiplier = 1
    if 'k' in num_str:
        multiplier = 1000
        num_str = num_str.replace('k', '')
    elif 'm' in num_str:
        multiplier = 1000000
        num_str = num_str.replace('m', '')
        
    # Remove dots and commas for normal numbers (like 81.096 or 81,096)
    # If there's a decimal dot in a K abbreviation (e.g. 20.5), we keep it as float first
    if '.' in num_str or ',' in num_str:
        if multiplier > 1:
            # e.g. "20.5" or "20,5" -> float
            num_str = num_str.replace(',', '.')
            try:
                return int(float(num_str) * multiplier)
            except ValueError:
                pass
        else:
            # e.g. "81.096" or "81,096" -> replace delimiter to get 81096
            num_str = num_str.replace('.', '').replace(',', '')
            
    try:
        return int(float(num_str) * multiplier)
    except ValueError:
        # Fallback if parsing fails
        cleaned = re.sub(r'[^\d]', '', num_str)
        return int(cleaned) if cleaned else None

def get_instagram_followers():
    print("Scraping Instagram via Selenium...")
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument(f"user-agent={HEADERS['User-Agent']}")
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
    try:
        url = "https://www.instagram.com/quadratin.morelos/"
        driver.get(url)
        time.sleep(5)  # Wait for page to render fully
        
        html = driver.page_source
        
        # Regex search for: e.g. "20K seguidores" or "20,500 seguidores" or "20.5k followers"
        matches = re.findall(r'([\d.,]+\s*[kKmM]?)\s*(?:followers|seguidores)', html, re.I)
        if matches:
            # The first match is usually the followers count
            print(f"Instagram raw matches: {matches}")
            followers = parse_abbreviated_number(matches[0])
            print(f"Instagram followers parsed: {followers}")
            return followers
        else:
            print("Instagram: No followers match found in page source.")
            return None
    except Exception as e:
        print(f"Instagram scrape failed: {e}")
        return None
    finally:
        driver.quit()

def get_tiktok_followers():
    print("Scraping TikTok...")
    url = "https://www.tiktok.com/@quadratinmorelos"
    
    # Try requests first, then fallback to urllib, with up to 3 retries
    for attempt in range(3):
        try:
            r = requests.get(url, headers=HEADERS, timeout=10)
            if r.status_code == 200:
                html = r.text
            else:
                print(f"TikTok attempt {attempt+1} requests status code: {r.status_code}")
                html = ""
        except Exception as e:
            print(f"TikTok attempt {attempt+1} requests failed: {e}")
            html = ""
            
        if not html:
            # Fallback to urllib
            try:
                import urllib.request
                req = urllib.request.Request(url, headers=HEADERS)
                with urllib.request.urlopen(req, timeout=10) as response:
                    html = response.read().decode('utf-8', errors='ignore')
            except Exception as e:
                print(f"TikTok attempt {attempt+1} urllib failed: {e}")
                html = ""
                
        if html:
            # Search for followerCount in various formats
            patterns = [
                r'"followerCount":\s*(\d+)',
                r'followerCount\\":\s*(\d+)',
                r'"followers"\s*:\s*(\d+)',
                r'followers\\":\s*(\d+)'
            ]
            for pat in patterns:
                match = re.search(pat, html)
                if match:
                    followers = int(match.group(1))
                    print(f"TikTok followers found: {followers}")
                    return followers
            
            # If we got HTML but no matches, let's print a warning
            print(f"TikTok attempt {attempt+1} loaded HTML (length {len(html)}) but no pattern matched.")
            
        time.sleep(2)
        
    print("TikTok: Failed to extract followerCount after all attempts.")
    return None

def get_facebook_followers():
    print("Scraping Facebook Page Plugin...")
    # Using the Facebook Page Plugin to bypass rate limits and login walls
    url = "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FQuadratinMorelos&tabs&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            # Search for e.g. "81.096 seguidores" or "81K likes"
            matches = re.findall(r'([\d.,]+\s*[kKmM]?)\s*(?:likes|Me gusta|followers|seguidores)', r.text, re.I)
            if matches:
                # The first one is typically the followers count
                print(f"Facebook raw matches: {matches}")
                followers = parse_abbreviated_number(matches[0])
                print(f"Facebook followers: {followers}")
                return followers
            else:
                print("Facebook: no follower matches found in plugin HTML.")
        else:
            print(f"Facebook plugin status code: {r.status_code}")
    except Exception as e:
        print(f"Facebook failed: {e}")
    return None

def get_twitter_followers():
    print("Scraping Twitter/X...")
    url = "https://x.com/Quadratin_Mor"
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            # Search for `"followers_count":(\d+)` inside the initial state JSON
            match = re.search(r'"followers_count":(\d+)', r.text)
            if match:
                followers = int(match.group(1))
                print(f"Twitter/X followers: {followers}")
                return followers
            else:
                print("Twitter/X: followers_count not found in HTML.")
        else:
            print(f"Twitter/X status code: {r.status_code}")
    except Exception as e:
        print(f"Twitter/X failed: {e}")
    return None

def main():
    print(f"=== SOCIAL MEDIA UPDATER - {datetime.datetime.now()} ===")
    
    # Load existing data from src/data.js
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            content = f.read()
            # Strip "export const qm_data = " and trailing semicolon
            json_str = content.replace("export const qm_data = ", "").strip()
            if json_str.endswith(";"):
                json_str = json_str[:-1]
            data = json.loads(json_str)
    else:
        # Fallback structure
        data = {
            "history": [],
            "goals": {
                "instagram": 13500,
                "tiktok": 7500,
                "facebook": 84000,
                "twitter": 15200
            }
        }
    
    # Fetch current metrics
    instagram = get_instagram_followers()
    tiktok = get_tiktok_followers()
    facebook = get_facebook_followers()
    twitter = get_twitter_followers()
    
    # Check if we got at least one metric to update
    if not any([instagram, tiktok, facebook, twitter]):
        print("Error: Could not retrieve any metrics. Aborting update.")
        return

    # Use existing last value if a scrape failed to avoid losing data
    today_str = datetime.date.today().isoformat()
    
    # Retrieve last known values as fallback
    last_entry = data["history"][-1] if data["history"] else {}
    
    new_entry = {
        "date": today_str,
        "instagram": instagram if instagram is not None else last_entry.get("instagram", 0),
        "tiktok": tiktok if tiktok is not None else last_entry.get("tiktok", 0),
        "facebook": facebook if facebook is not None else last_entry.get("facebook", 0),
        "twitter": twitter if twitter is not None else last_entry.get("twitter", 0)
    }
    
    # If scraping failed for a platform, flag it so frontend knows
    failed_platforms = []
    if instagram is None: failed_platforms.append("instagram")
    if tiktok is None: failed_platforms.append("tiktok")
    if facebook is None: failed_platforms.append("facebook")
    if twitter is None: failed_platforms.append("twitter")
    
    if failed_platforms:
        new_entry["failed_scrapes"] = failed_platforms
        print(f"Warnings: Failed to scrape: {failed_platforms}")

    # Check if there is already an entry for today
    today_index = -1
    for idx, entry in enumerate(data["history"]):
        if entry["date"] == today_str:
            today_index = idx
            break
            
    if today_index != -1:
        # Update today's entry
        # If a scrape failed today but we had succeeded earlier today, preserve the previous value
        prev_today = data["history"][today_index]
        for key in ["instagram", "tiktok", "facebook", "twitter"]:
            # If new is 0 or fallback, but previous was non-zero, keep previous
            if new_entry[key] == 0 or key in failed_platforms:
                if prev_today.get(key, 0) > 0:
                    new_entry[key] = prev_today[key]
        
        # Merge failed scrapes flags
        prev_failed = prev_today.get("failed_scrapes", [])
        new_failed = list(set(failed_platforms) & set(prev_failed)) # only keep if both failed
        if new_failed:
            new_entry["failed_scrapes"] = new_failed
        elif "failed_scrapes" in new_entry:
            del new_entry["failed_scrapes"]
            
        data["history"][today_index] = new_entry
        print("Updated existing entry for today.")
    else:
        # Append new entry
        data["history"].append(new_entry)
        print("Added new entry for today.")
        
    # Save back to src/data.js
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        f.write("export const qm_data = " + json.dumps(data, indent=2, ensure_ascii=False) + ";\n")
        
    print("src/data.js updated successfully!")

if __name__ == "__main__":
    main()
