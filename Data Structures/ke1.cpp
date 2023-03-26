#include <stdio.h>

int main(){
	
	int n;
	scanf("%d",&n);
	
	for(int i=0;i<n;i++){
		for(int j=0;j<n;j++){
			if(i>=n-n/3 && j>=n/3 && j<i){
				if(j<n && j>=n-n/3)printf(" ");
				printf("*");
			}
			else printf(" ");
		}
		printf("\n");
	}
	
	return 0;
}
