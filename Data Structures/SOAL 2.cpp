#include <stdio.h>
#include <string.h>

int main(){
	char x;
	
	char str[100];
	char strtamp[100];
	scanf("%c\n",&x);
	
	scanf("%[^\n]",str);
	int tampakhir;
	int tampawal;
	int n=strlen(str);
	int p=0;
	for(int i=0;i<n;i++){
		for(int j=0;j<n;j++){
			if(str[j]==x){
				tampakhir=j;
				int count=0;
				for(int k=j;k<strlen(str);k--){
					if(str[k]!=' ' || k-1<0) count++;
					else tampawal=k;
				}
//				tampawal=k;
//				p++;
			for(int t=tampawal;t<=tampakhir;t++){
				str[t]=str[tampakhir-t];
			}
		}	
		}
	
	}
	printf("%s\n",str);
	
	return 0;
}
