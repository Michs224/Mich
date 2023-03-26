#include <stdio.h>
#include <string.h>

int main(){

	int T,Q,i,j,k,L,M,Z,a,x;
	char ss[1000];

	scanf("%d",&T);

	for(i=1;i<=T;i++){
		scanf("%d %s",&Q,&ss);
		for(j=1;j<=Q;j++){
			scanf("%d %d",&L,&M);
			a=M-L+1;
			for(k=0;k<(a/2);k++){
				Z=ss[L-1];
				ss[L-1]=ss[M-k-1];
				ss[M-k-1]=Z;
				L+=1;

			}
		}
		printf("Case #%d: %s\n",i,ss);
	}

	return 0;
}
