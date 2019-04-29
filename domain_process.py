import json

processed_result = set()
f = open("bad-domains.txt", "r")
for line in f:

    if line[0] != "#":
        split_result = line.strip("\t").split("\t")
        processed_result.add(split_result[0])

result = open("processed-bad-domains.json", "w")
print("the size of processed domain set is:"+str(len(processed_result)))
result.write(json.dumps(list(processed_result)))
result.close()
f.close()
