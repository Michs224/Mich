#include <stdio.h>
#include <math.h>
int main(){
	int T,i,y=0;
	scanf("%d",&T);
	for(i=0;i<T;i++){
	long c;
	scanf("%d",&c); 
	if(c%2==1){
		y=c;
		printf("Case #1: Need more frog\n");
	}else printf("Case #2: Party time!\n");
}
	return(0);
}
