import json

with open("jobs.json") as f:
    data = json.load(f)

for job in data.get("jobs", []):
    print(f"Job: {job['name']} - Status: {job.get('conclusion')}")
    if job.get('conclusion') == 'failure':
        print(f"FAILED JOB ID: {job['id']}")
