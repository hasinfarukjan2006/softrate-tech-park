import os

log_dir = r"C:\Users\dellc\.gemini\antigravity\brain\5373b926-87ff-4073-a856-06c39c426ce2\.system_generated\logs"
transcript_path = os.path.join(log_dir, "transcript.jsonl")

if os.path.exists(transcript_path):
    print("Transcript found!")
    with open(transcript_path, "r", encoding="utf-8", errors="ignore") as f:
        for i, line in enumerate(f):
            if "break_even.css" in line or "break-even" in line.lower() or "segmented" in line.lower():
                print(f"Line {i+1}: len={len(line)}")
                # Print a small slice of the line
                print(line[:300])
else:
    print("Transcript not found at", transcript_path)
