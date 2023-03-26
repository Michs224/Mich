#include <stdio.h>

int main(){
	int N,M,O;
	char ss[100],tt[100],uu[100];
	
	scanf("%d",&N);
	scanf("%s",&ss);
	scanf("%d",&M);
	scanf("%s",&tt);
	scanf("%d",&O);
	scanf("%s",&uu);
	
	printf("%c%c\n",ss[N-1],ss[0]);
	printf("%c%c\n",tt[M-1],tt[0]);
	printf("%c%c\n",uu[O-1],uu[0]);
	
	return(0);
	
}
