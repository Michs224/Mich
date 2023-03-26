#include <stdio.h>
#include <math.h>

int main(){
	
	long int N,P,B,i,X;

	scanf("%ld %ld",&N,&P);
	X=0;
	for(i=0;i<N;i++){
		scanf("%ld",&B);
		if(B<P){
			X++;
		}
	}
	printf("%ld\n",X);
	
	return(0);
}

