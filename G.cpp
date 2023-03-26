#include <stdio.h>
#include <string.h>

int main(){
	int T,N,A,odd,even;
	scanf("%d",&T);
	
	for(int t=1; t<=T; t++){
		odd=0;
		even=0;
		scanf("%d",&N);
		for(int i=0; i<N; i++){
			scanf("%d",&A);
			if(A%2==0) even++;
			else odd++;
		}
		printf("Odd group : %d integer(s).\n",odd);
		printf("Even group : %d integer(s).\n\n",even);
	}
}
