def get_input_as_dict(input_string):
    d = {}
    pairs = input_string.split(',')
    for pair in pairs:
        key, values = pair.split(':')
        d[key.strip()] = values.strip()
    return d

def first_set(i):
    if result_dict.get(i) is not None:
        v=result_dict[i]
        if 'id' in v or 'e' in v:
            m=v.split()
            fs.append(m[-1])
        v=v[:1]
        first_set(v)
    else:
        fs.append(i)

# Get user input
fs=[]
user_input = input("Enter key-value pairs separated by ',': ")
user_input=user_input.replace("->",":")
result_dict = get_input_as_dict(user_input)
p=list(result_dict.keys())
for i in p:
    first_set(i)
index=0
for i in range(0,len(fs),2):
    print("firstSet:"+p[index] +"="+"{" + fs[i+1]+","+fs[i]+"}")
    index+=1

    
