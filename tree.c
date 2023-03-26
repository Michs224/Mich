#include <stdio.h>
#include <math.h>

int main(){
	int T,N,i,j,A,c;
	scanf("%d",&T);
	for(i=1;i<=T;i++){
		scanf("%d",&N);
		c=0;
		for(j=1;j<=N;j++){
			scanf("%d",&A);
			c+=A;
		}
		printf("Case #%d: %d\n",i,c);
	}
	return(0);
}
