n=int(input('n:'))
print("Simple Number triangle")
for row in range(n):
    print((str(row)+" ")*(row))

print("Inverted pyramid")
for row in range(n):
    print((str(row)+" ")*(n-row+1))

print("Half pyramid pattern")
for row in range(1,n+1):
    for col in range(1,row+1):
        print(col,end=" ")
    print()

print("#Inverted pyramid pattern")
# for row in range(n):
#     print((str(n-row)+" ")*(n-row))
for row in range(n,0,-1):
    print((str(row)+" ")*(row))

print("#Reverse pyramid")
for row in range(1,n+1):
    for col in range(row,0,-1):
        print(col,end=" ")
    print()

print("#Half inverted pyramid")
for row in range(n,0,-1):
    for col in range(row+1):
        print(col,end=" ")
    print()

print("#pyramid of natural number")
num=1
for row in range(1,n,2):
    if num==n:
        row=n
        break
    for col in range(row):
        print(num,end=" ")
        num+=1
    print()

print("#pyramid shape(equalateral)")
space=n
for row in range(1,n+1):
    print(" "*space,end=" ")
    for col in range(1,row+1):
        print(col,end=" ")
    space-=1
    print()
