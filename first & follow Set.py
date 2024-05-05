#finding production name----
def getKey(k):
    for key, value in d.items():
        if k in value:
            return key
    return None

#Finding FirstSet-----
def find(x):
    y = []
    for i in x:
        if i[0] in d.keys(): #checking Non-terminal
            y.extend(find(d[i[0]]))
        else: #if terminal add to list y and add y to firstset
            y.append(i[0])     
    return y   

def firstSet():
    print("FIRST-SET:")
    for name, production in d.items():
        first[name] = find(production)
        print(f'{name}:{first[name]}') # print name with its firstset

def followSet():
    print("FOLLOW-SET:")
    name = [key for key in d.keys()]
    ss = name[0]  # starting symbol
    production = [p for p in d.values()]
    follow[ss] = ['$']
    for i in name:
        for prod in production:
            for k in prod:
                if i in k:# finding production eg: E is presented in F production F->(E)
                    index_value = k.index(i) + 1
                    if index_value < len(k):
                        y = find(k[index_value])
                        if 'e' not in y:
                            follow[i].extend(y)
                        else: # add all except epsilon 
                            y[y.index('e')]=follow[k[index_value]]
                            follow[i]=y
                    else:#No follow value then eg:E -> TX  follow(X) is follow(E)
                        y = follow[getKey(k)]
                        follow[i] = y
    for name,value in follow.items():
        print(f'{name}:{value}')
                        
# main function--------    
n = int(input("Enter no of production: "))
d = {}
first = {}
follow = {}
for i in range(n):
    ip = input(f'Enter Production {i+1}:')
    name, prod = ip.split('->')
    p = prod.split('|')
    d[name] = p #save input in dictionary form
firstSet()
followSet()

'''
Enter no of production: 5        
Enter Production 1:E->TX
Enter Production 2:X->+TX|e
Enter Production 3:T->FY
Enter Production 4:Y->*FY|e
Enter Production 5:F->(E)|a

FIRST-SET:
E:['(', 'a']
X:['+', 'e']
T:['(', 'a']
Y:['*', 'e']
F:['(', 'a']
FOLLOW-SET:
E:['$', ')']
X:['$', ')']
T:['+', ['$', ')']]
Y:['+', ['$', ')']]
F:['*', ['+', ['$', ')']]]
'''
