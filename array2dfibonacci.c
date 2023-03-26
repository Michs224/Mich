#include <stdio.h>
#include <math.h>

int main(){
	
	int n,m;
	int i,j;

	
	scanf("%d %d",&n,&m);
	int fibo[n][m];

	fibo[0][0] = 0;
	fibo[0][1] = 1;
	
	printf("%d %d ",fibo[0][0],fibo[0][1]);
	for(i=0;i<n;i++){
			
		for(j=2;j<m;j++){
			fibo[i][j]=fibo[i][j-1]+fibo[i][j-2];
			printf("%d ",fibo[i][j]);
		}
		printf("\n");
		if(i==n-1) break;

		fibo[i+1][0]=fibo[i][m-2]+fibo[i][m-1];
		printf("%d ",fibo[i+1][0]);
			
		fibo[i+1][1]=fibo[i+1][0]+fibo[i][m-1];
		printf("%d ",fibo[i+1][1]);
	
		}
		
		return 0;
	}
