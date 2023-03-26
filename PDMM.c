#include <stdio.h>
#include <math.h>

int main(){
	int N,M,i,c;
	scanf("%d",&N);
	i=1;
	while(i<=N){
		if(i%10==0) M++;
	    else c=1;
		i++;
	}
	if(N%10==0);
	else M=M+c;
	printf("Kandangnya berjumlah: %d\n",M);
	return(0);
}
