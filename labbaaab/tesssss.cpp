#include <stdio.h>
#include <string.h>

int main(){
	char x[100],y[100];
	for(int i=0;i<5;i++){
		scanf("%[^\#]#%[^\n]",&x,&y);
		printf("%s %s",x,y);
	}
}
