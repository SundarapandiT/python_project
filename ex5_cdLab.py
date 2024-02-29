def get_input_as_dict(input_string):
    d = {}
    pairs = input_string.split(',')
    for pair in pairs:
        key, values = pair.split(':')
        d[key.strip()] = values.strip()
    return d

def first_set(i):
    global index
    if result_dict.get(i) is not None:
        v=result_dict[i]
        if 'id' in v or 'e' in v or 'ε' in v:
            m=v.split()
            fs.append(m[-1])
        v=v[:1]
        first_set(v)
    else:
        fs.append(i)
        print(F'FirstSet({p[index]})={fs}')
        index+=1
        fs.clear()
# Get user input
fs=[]
index=0
user_input = input("Enter key-value pairs separated by ',': ")
user_input=user_input.replace("->",":")
result_dict = get_input_as_dict(user_input)
p=list(result_dict.keys())
for i in p:
    first_set(i)

'''Input:
Enter key-value pairs separated by ',': E -> TE' , E' -> +TE' | ε , T -> FT' , T' -> *FT' | e , F -> (E) | id

Output:
FirstSet(E)=['id', '(']
FirstSet(E')=['ε', '+']
FirstSet(T)=['id', '(']
FirstSet(T')=['e', '*']
FirstSet(F)=['id', '(']
'''
