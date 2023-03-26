#include <stdio.h>

int main(){
	int l,k,b,c=0;
	scanf("%d",&l);
	k=l;
	l/=2;
	b=l;
	while(b<=k){
		b+=2;
		c+=1;
	}
	for(int x=0;x<c;x++){
		for(int y=1;y<=k;y++){
			if(y<c-x){
				printf(" ");
			}else{
				for(int z=0;z<l;z++){
					printf("*");
				}
				l+=2;
				break;
			}
		}
		printf("\n");
	}
	
}