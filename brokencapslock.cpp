#include <stdio.h>
#include <string.h>

int main(){
	int T;
	char ss[1001];
	
	scanf("%d",&T);
	
	for(int i=0;i<T;i++){
		scanf("%s",ss);
		for(int j=0;j<strlen(ss);j++){
			if(ss[j]>='A' && ss[j]<='Z'){
				ss[j]=ss[j]+32;
			}
			else if(ss[j]>='a' && ss[j]<='z'){
				ss[j]=ss[j]-32;
			}
		}
		printf("%s\n",ss);
	}
	return(0);
}
