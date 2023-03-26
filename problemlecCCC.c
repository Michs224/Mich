#include <stdio.h>

int main(){
	long d,s,t;
	scanf("%d %d %d",&d,&s,&t);
		
	if(d>s && d>t && s>t) {
		printf("Daging\n");
		printf("Sayur\n");
		printf("Telur\n");
	}	
	else if(d>s && d>t && s<t) {
		printf("Daging\n");
		printf("Telur\n");
		printf("Sayur\n");
	}	
	else if(s>d && s>t && d>t) {
		printf("Sayur\n");
		printf("Daging\n");
		printf("Telur\n");
	}	
	else if(s>d && s>t && d<t) {
		printf("Sayur\n");
		printf("Telur\n");
		printf("Daging\n");
	}	
	else if(t>d && t>s && d>s) {
		printf("Telur\n");
		printf("Daging\n");
		printf("Sayur\n");
	}	
	else if(t>d && t>s && d<s) {
		printf("Telur\n");
		printf("Sayur\n");
		printf("Daging\n");
	}	

	return (0);
}
