#include <stdio.h>

int jobonacci(int n){
	if (n==0) return 0;
	else if(n>0 && n<=3) return 1;
	else if(n%2==1) return 1;
	else return jobonacci(n-1)+jobonacci(n-2);
}

int main(){
	int N,X;
	scanf("%d",&N);
	X=jobonacci(N);
	
	printf("%d\n",X);
}
