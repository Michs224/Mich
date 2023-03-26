#include <stdio.h>
#include <math.h>
int main(){
	int T,i,y=0;
	scanf("%d",&T);
	for(i=0;i<T;i++){
	long c,d;
	scanf("%d %d",&c,&d); 
	if(c%2==1 && d%2==1){
		printf("Case #1: Need more frogs\n");
	}if (c%2==0 && d%2==0) printf("Case #2: Party time!\n");
}
	return(0);
}
