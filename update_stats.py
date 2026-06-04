import requests
import json
import os
import datetime
import time

# Configurations
DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "data.js")

# RapidAPI Key: reads from env variable RAPIDAPI_KEY, fallback to user's current key
RAPIDAPI_KEY = os.environ.get("RAPIDAPI_KEY", "ca3f2f8d2msh2837e1472c671ap19ab72jsnc2437284c988")

def find_count_recursive(data, target_keys):
    """Recursively search for a count value matching target keys in nested data structures."""
    if isinstance(data, dict):
        # First check direct keys at this level
        for k in target_keys:
            if k in data:
                val = data[k]
                if isinstance(val, (int, float)):
                    return int(val)
                elif isinstance(val, str):
                    try:
                        return int(float(val))
                    except ValueError:
                        pass
                elif isinstance(val, dict) and "count" in val:
                    c = val["count"]
                    if isinstance(c, (int, float)):
                        return int(c)
        # Otherwise descend into sub-structures
        for v in data.values():
            res = find_count_recursive(v, target_keys)
            if res is not None:
                return res
    elif isinstance(data, list):
        for item in data:
            res = find_count_recursive(item, target_keys)
            if res is not None:
                return res
    return None

def get_instagram_followers():
    print("Fetching Instagram followers via RapidAPI...")
    url = "https://instagram-looter2.p.rapidapi.com/profile"
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "instagram-looter2.p.rapidapi.com"
    }
    params = {"username": "quadratin.morelos"}
    try:
        r = requests.get(url, headers=headers, params=params, timeout=15)
        if r.status_code == 200:
            data = r.json()
            count = None
            if isinstance(data, dict):
                # Try standard graphql paths
                count = (data.get("user", {}).get("edge_followed_by", {}).get("count") or
                         data.get("graphql", {}).get("user", {}).get("edge_followed_by", {}).get("count"))
            if count is None:
                # Recursive fallback
                count = find_count_recursive(data, ["edge_followed_by", "follower_count", "followers"])
            
            if count is not None:
                print(f"Instagram followers: {count}")
                return count
            else:
                print(f"Instagram: Could not find follower count in JSON: {str(data)[:300]}")
        else:
            print(f"Instagram API Error {r.status_code}: {r.text}")
    except Exception as e:
        print(f"Instagram API Exception: {e}")
    return None

def get_tiktok_followers():
    print("Fetching TikTok followers via RapidAPI...")
    url = "https://tiktok-scraper7.p.rapidapi.com/user/detail"
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "tiktok-scraper7.p.rapidapi.com"
    }
    params = {"unique_id": "quadratinmorelos"}
    try:
        r = requests.get(url, headers=headers, params=params, timeout=15)
        if r.status_code == 200:
            data = r.json()
            count = None
            if isinstance(data, dict):
                d = data.get("data", {})
                if isinstance(d, dict):
                    # Try stats key
                    count = d.get("stats", {}).get("followerCount") or d.get("user", {}).get("stats", {}).get("followerCount")
            if count is None:
                count = find_count_recursive(data, ["followerCount", "follower_count", "followers"])
            
            if count is not None:
                print(f"TikTok followers: {count}")
                return count
            else:
                print(f"TikTok: Could not find follower count in JSON: {str(data)[:300]}")
        else:
            print(f"TikTok API Error {r.status_code}: {r.text}")
    except Exception as e:
        print(f"TikTok API Exception: {e}")
    return None

def get_facebook_followers():
    # Facebook has a limit of 25/month. Skip on weekends.
    is_weekend = datetime.datetime.today().weekday() in (5, 6)
    if is_weekend:
        print("Facebook API call skipped (weekend limit preservation)")
        return None

    print("Fetching Facebook followers via RapidAPI...")
    url = "https://facebook-pages-scraper2.p.rapidapi.com/get_facebook_pages_details"
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "facebook-pages-scraper2.p.rapidapi.com"
    }
    params = {
        "link": "https://www.facebook.com/QuadratinMorelos",
        "show_verified_badge": "false",
        "proxy_country": "us"
    }
    try:
        r = requests.get(url, headers=headers, params=params, timeout=15)
        if r.status_code == 200:
            data = r.json()
            count = None
            if isinstance(data, dict):
                d = data.get("data", {})
                if isinstance(d, dict):
                    count = d.get("followers") or d.get("followers_count") or d.get("likes") or d.get("likes_count")
            if count is None:
                count = find_count_recursive(data, ["followers", "followers_count", "likes", "likes_count"])
            
            if count is not None:
                print(f"Facebook followers: {count}")
                return count
            else:
                print(f"Facebook: Could not find follower/like count in JSON: {str(data)[:300]}")
        else:
            print(f"Facebook API Error {r.status_code}: {r.text}")
    except Exception as e:
        print(f"Facebook API Exception: {e}")
    return None

def get_twitter_followers():
    print("Fetching Twitter/X followers via RapidAPI...")
    url = "https://twitter-api45.p.rapidapi.com/screenname.php"
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "twitter-api45.p.rapidapi.com"
    }
    params = {"screenname": "Quadratin_Mor"}
    try:
        r = requests.get(url, headers=headers, params=params, timeout=15)
        if r.status_code == 200:
            data = r.json()
            count = None
            if isinstance(data, dict):
                count = data.get("followers_count") or data.get("sub_count") or data.get("followers")
            if count is None:
                count = find_count_recursive(data, ["followers_count", "sub_count", "followers"])
            
            if count is not None:
                print(f"Twitter/X followers: {count}")
                return count
            else:
                print(f"Twitter/X: Could not find follower count in JSON: {str(data)[:300]}")
        else:
            print(f"Twitter/X API Error {r.status_code}: {r.text}")
    except Exception as e:
        print(f"Twitter/X API Exception: {e}")
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
    # Facebook is only "failed" if it's not a weekend and returned None
    is_weekend = datetime.datetime.today().weekday() in (5, 6)
    if facebook is None and not is_weekend: failed_platforms.append("facebook")
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
