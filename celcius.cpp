#include <stdio.h>
#include <math.h>

int main(){
	float c,r,f,k;
	int T;
	scanf("%d\n",&T);
	for(int i=0;i<T;i++){
		scanf("%f",&c);
		r=0.8*c;
		f=1.8*c +32;
		k=c+273;
		
		printf("%.2f %.2f %.2f",r,f,k);
		
	}
	
	return(0);
}
