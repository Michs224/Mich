#include <stdio.h>

int main(){
	int N,x;
	
	scanf("%d",&N);
	x=0;
	for(int i=1;i<N;i++){
		if(N%i==0){
			x+=i;
		}
		
	}
	if(x==N)printf("Perfect Number\n");
	else printf("Not Perfect Number\n");
	
	return(0);
}
