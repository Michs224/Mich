import numpy as np
a = np.array([[8, 3, -3],
              [-2, -8, 5],
              [3, 5, 10]])

diag = np.diag(np.abs(a))
diag_off = np.sum(np.abs(a),axis=1) - diag

if np.all(diag > diag_off):
    print("Diagonal dominance")
else:
    print("not diagonal dominance")
    


# Gauss-seidel

# In[28]:


x = np.array([0.0,0.0,0.0]).astype('float')
epsilon = 0.01
x_old = np.array([0.0,0.0,0.0]).astype('float')

b = np.array([14,5,-8])
not_converged = True

for i in range(50):
    for j in range(len(x)):
        temp_a = [a[j,k] for k in range(len(x)) if k != j]
        temp_x = [x[k] for k in range(len(x)) if k != j]
        x[j] = (b[j] - np.dot(temp_a,temp_x))/a[j,j]
    
    error = np.abs((x-x_old)/x)*100
    print(i+1,x,error)
    if np.max(error) < epsilon:
        not_converged = False
        break
    x_old = np.array([x[0],x[1],x[2]])
    
x1,x2,x3=x[0],x[1],x[2]
print("X1=",x1,"X2=",x2,"X3=",x3)