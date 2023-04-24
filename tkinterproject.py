from tkinter import *
window=Tk()
window.title("Marksheet")
#create required attributes
Label(window,text="Name").grid(row=1,column=1)
Label(window,text="RollNo").grid(row=2,column=1)
Label(window,text="Mark").grid(row=3,column=1)
Label(window,text="Grade").grid(row=4,column=1)
Label(window,text="Result").grid(row=5,column=1)
#create input box
name=StringVar()
Entry(window,textvariable=name,justify=RIGHT).grid(row=1,column=2,sticky=E)
roll=StringVar()
Entry(window,textvariable=roll,justify=RIGHT).grid(row=2,column=2,sticky=E)
mark=StringVar()
Entry(window,textvariable=mark,justify=RIGHT).grid(row=3,column=2,sticky=E)
grade=StringVar()
Label(window,textvariable=grade,justify=RIGHT).grid(row=4,column=2,sticky=E)
result=StringVar()
Label(window,textvariable=result,justify=RIGHT).grid(row=5,column=2,sticky=E)
#create method to find result and grade
def findresult():
    Mark=eval(mark.get())
    result.set("Pass")
    if Mark>=90:
        grade.set("S")
    elif Mark<90 and Mark>=80:
        grade.set("A")
    elif Mark<80 and Mark>=70:
        grade.set("B")
    elif Mark<70 and Mark>=60:
        grade.set("C")
    elif Mark<60 and Mark>=50:
        grade.set("D")
    elif Mark<50 and Mark>=35:
        grade.set("E")
    elif Mark<35:
        grade.set("RA")
        result.set("Fail")
    return (grade,result)
        
#create button to submit and find result
submit=Button(window,text="Result",command=findresult).grid(row=6,column=3)

window.mainloop()
