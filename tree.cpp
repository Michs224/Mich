#include <stdio.h>
#include <math.h>

	int jlhPohon(int a[b], int b){
		if(b==0){
			return 1;
		}
		else return a[b] + jlhPohon(a[b],b-1);
	}
	
int main(){
	int T,N,i,j;

	scanf("%d",&T);
	for(i=0;i<T;i++){
		scanf("%d",&N);
		int A[N];
		for(j=0;j<N;j++){
			scanf("%d",&A[j]);
		}
		printf("%d",jlhPohon(A[j],j));
	}
	return(0);
}
	
	
	

