#include <stdio.h>
#include <string.h>

int main(){
	int x,y,T,b,k,m;
	
	scanf("%d %d",&x,&y);
	int s[x][y];
	for(int i=0;i<x;i++){
		for(int j=0;j<y;j++){
			scanf("%d",&s[i][j]);
		}
	}
	scanf("%d",&T);
	for(int i=0;i<T;i++){
		scanf("%d %d %d",&b,&k,&m);
		for(int j=0;j<T;j++){
			s[b-1][k-1]=m;
		}
	}
	
	for(int i=0;i<x;i++){
		for(int j=0;j<y;j++){
			printf("%d ",s[i][j]);
		}
		printf("\n");
	}
	return(0);
	
}
