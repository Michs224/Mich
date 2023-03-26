#include <stdio.h>

int main(){
	
	int N,i,j;
	
	scanf("%d",&N);
	
	for(i=1;i<=N;i++){
		for(j=1;j<=N;j++){
			if(j>1 && j<10 && i!=1 && i!=10) {
			printf(" ");
		}
			else {
			printf("*");
		}
		}
		printf("\n");
	}
	return(0);
}
