# GAUSSIAN METHOD

import numpy as np

n=int(input("Masukkan ukuran matrix: "))
a=np.zeros((n,n)).astype('float')
b=np.zeros(n).astype('float')
print("Masukkan elemen matrix: ")
for i in range(n):
    for j in range(n):
        a[i,j]=float(input("a["+str(i)+","+str(j)+"]: "))

print("Masukkan hasilnya: ")
for i in range(n):
    b[i]=float(input("Hasil persamaan ke-"+str(i+1)+": "))
print("\nMatrix yang dimasukkan: ")
print(a)
print("Hasil persamaan yang dimasukkan: ")
print(b)

for i in range(n):
    #cek diagonal 0 atau nggak
    if a[i,i]==0:
        for j in range(i+1,n):
            if np.fabs(a[j,i]) > np.fabs(a[i,i]):
                for k in range (i,n):
                    a[i,k]=a[j,k]
                    a[j,k]=a[i,k]
                b[i]=b[j]
                b[j]=b[i]
                break
    if a[i,i]==0:#kalau masih 0
        print("Pivotnya bakal 0 dan pas nanti dibagi untuk mencari C bakalan dibagi dengan 0")
        break
    m=np.zeros((n,n))

    # print(i)
# for i in range (n):
    pivot=a[i,i]
    for j in range (i+1,n):
        m[j,i]=a[j,i]/pivot
        # c=a[j,i]/pivot
        c=m[j,i]
        for k in range(n):
            a[j,k]=a[j,k]-c*a[i,k]
        b[j]=b[j]-c*b[i] #elemen-elemen kiri bawah di 0 kan

#Cari hasilnya
print("\nHasil setelah di Gaussian: ")
print(a),print(b)

x=np.zeros(n).astype('float')

x[n-1]=b[n-1]/a[n-1][n-1]

for i in range (n-2,-1,-1):
    s=0
    for j in range (i+1,n):
        s=s+a[i,j]*x[j]
        x[i]=(b[i]-s)/a[i,i]

print("\nSolusi: ")

for i in range(n):
    print("X"+str(i+1)+"= ",x[i])

# print("\nNilai X= ",x)



