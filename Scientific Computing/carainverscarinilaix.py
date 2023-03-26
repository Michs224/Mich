no. 1 (coding)
import numpy as np
A = np.array([(11, 7, -2), (1, 5, 1), (3, 1, -4)])
C = np.array ([6, -5, -2])
print(A)
print(C)

A_inv = np.linalg.inv(A) #menyelesaikan dengan invers
X=np.dot(A_inv, C) #menyelesaikan dalam bentuk matrix
print(X)

[[11 7 -2]
[ 1 5 1]
[ 3 1 -4]]
[ 6 -5 -2]
[ 1.88311688 -1.67532468 1.49350649]

no. 2 (coding)
import numpy as np
A = np.array([(10, -5, 2), (3,4,8), (1,5,-5)])
C = np.array ([6,-7,9])
print(A)
print(C)

A_inv = np.linalg.inv(A) #menyelesaikan dengan invers
X=np.dot(A_inv, C) #menyelesaikan dalam bentuk matrix
print(X)

[[10 -5 2]
[ 3 4 8]
[ 1 5 -5]]
[ 6 -7 9]
[ 0.99134199 0.23665224 -1.36507937]