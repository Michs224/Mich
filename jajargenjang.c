#include <stdio.h>
#include <math.h>

int main(){
	int T,N,i,j;
	
	scanf("%d %d",&T,&N);
	for(i=0;i<T;i++){
		for(j=0;j<N;j++){
			if(j>=T-1 && j<=N-1){
				printf("*");
				if(i>0 && i<=T-1 && j<=T-1 || j<=N-1 && j>T-1 || j<N) {
				printf(" ");
			}
			else printf("*");
			}
			else printf(" ");

		}
		
		N--;
	
	
		printf("\n");
	}
	return(0);
}
