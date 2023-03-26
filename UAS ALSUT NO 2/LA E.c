#include <stdio.h>

int main(){
	int N,i,j,arr[100];
	
	scanf("%d",&N);
	for(i=0;i<N;i++){
		scanf("%d",&arr[i]);
	}
	
	int x1=0,x2=0;
	for(j=0;j<N;j++){
		if(arr[j]==1)x1++;
		else x2++;
	}
	
	if(x1>x2)printf("not easy\n");
	else printf("easy\n");
	return 0;	
}
