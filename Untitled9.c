#include <stdio.h>

int main(){
	
    long int N, M, j;
    int T, X;
    
    scanf("%d", &T);
    
    for(X=1;X<=T;X++){
    	scanf("%ld %ld", &N,&M);
    		j = N*M;
    	 	if(j%2==1){
    		printf("Case #%d: Need more frogs\n", X);
		}
		else{
			printf("Case #%d: Party time!\n",X);
    }
}
    
	return 0;
}
