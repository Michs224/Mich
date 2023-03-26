#include <stdio.h>
#include <string.h>

int main(){
	int T;
	char ss[1001];
	
	scanf("%d",&T);
	
	for(int i=0;i<T;i++){
		scanf("%[^\n]",ss);
		for(int j=0;j<strlen(ss);i++){
			if(ss[i]>='A' && ss[i]<='Z'){
				ss[i]=ss[i]+32;
			}
			else if(ss[i]>='a' && ss[i]<='z'){
				ss[i]=ss[i]-32;
			}
		}
		printf("%s",ss);
	}
	return(0);
}
