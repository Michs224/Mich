#include <stdio.h>

int main(){
	int T,N,A,i,Nodd,Neven,digit,sum=0,sum1=0;
	scanf("%d",&T);
	
	for(i=1;i<=T;i++)
	{
		scanf("%d",&N);
		for(i=1;i<=N;i++){
			scanf("%d",&A);
			
			while(A>0){
				digit=A%10;
				if(digit%2==1)
				Nodd++;
				else Neven++;
			A=A/10;
			}
			sum=sum+Nodd;
			sum1=sum1+Neven;
		}
			printf("Odd group : %d integer(s)\n",sum);
			printf("Even group : %d integer(s)\n",sum1);
			
		
	}
	return(0);
}
