import re
stack=[]
def nfa_1(i, state):
    if 'a' <= i <= 'z':
        ns = state + 1
        return f"{state} --> {i} --> {ns}"
    else:
        return ''

def occurrence(state):
    ns = state + 1
    return f"{ns} --> e --> {state}"


def check(re_input):
    state=0
    regex=re_input.split()
    if "(" in re_input:
        regex = re_input.replace("(", " ( ").replace(")", " ) ").split()
        regex.remove("(")
        regex.remove(")")
    for i in regex:
        if "*" not in i and "|" not in i:
            substack=[]
            substack.append(nfa_1(i, state))
            state+=1
        elif "*" in i:
            substack=[]
            char=i[:-1]
            startingnode = state
            ns = state + 1
            if char=='':
                stack.append("*")
                continue

            substack.append(f"{state} --> e --> {ns}")
            state += 1
            substack.append(nfa_1(char, state))
            substack.append(occurrence(state))
            state += 1
            ns = state + 1
            substack.append(f"{state} --> e --> {ns}")
            substack.append(f"{startingnode} --> e --> {ns}")
            state += 1
        elif "|" in i:
            substack=[]
            startingnode = state
            char = i.split('|')
            if '' in char:char.remove('')
            endingnode = (len(char) * 2 + 1)+state
            for j in char:
                if j=='':
                    stack.append("*")
                    continue
                ns = state + 1
                substack.append(f"{startingnode} --> e --> {ns}")
                state += 1
                substack.append(nfa_1(j, state))
                state += 1
                substack.append(f"{state} --> e --> {endingnode}")
            state+=1
        stack.append(substack)
    for k in stack:
        for ele in k:print(ele)
    print(stack)

re_input = input("Enter regular expression: ")
check(re_input)
