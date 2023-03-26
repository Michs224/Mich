#include <stdio.h>
#include <math.h>

int main(){
	int M,A[100],c=0;
	scanf("%d",&M);
	for(int i=0;i<M;i++){
		scanf("%d",&A[i]);
		if(A[i+1] == A[i]-1)c++;
		printf("%d",A[i]);
	}

}
