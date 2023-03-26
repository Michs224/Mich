#include <stdio.h>

int main(){
	int N,i,j;
	char ss[100];
	scanf("%d",&N);
	
	for(i=1;i<=N;i++){
		scanf("%s",&ss);
		printf("Case #%d: %d\n",i,strlen(ss));
	}
	
	return(0);
}
