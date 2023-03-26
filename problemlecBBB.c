#include <stdio.h>

int main(){
	int T,A,B,i;
	
	scanf("%i",&T);
	
	for(i=1;i<=T;i++){
		scanf("%i %i",&A,&B);
		
		if(A>B) printf("Case #%d: Go-Jo\n",i);
		else printf("Case #%d: Bi-Pay\n",i);
	}
	return (0);
}
