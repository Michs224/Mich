#include <stdio.h>
#include <string.h>

int main(){
	
	int T,N,i,j;
	char kar[T],x;
	
	scanf("%d",&T);
	
	for(i=0;i<T;i++){
		kar[i]=0;
	}
	
	for(i=0;i<T;i++){
		for(j=0;j<T;j++){
			scanf("%s",&x);
		
			if(x>='a' && x<= 'z' || x>='A' && x<='Z') kar[i]++;
		}
	}
	
	
	return (0);
}
