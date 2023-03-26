#include <stdio.h>
#include <string.h>

struct data {
	char str2[1000];
	
};


int main(){
	struct data strx[1000];
	int T;
	char str[1000]; 
	
	scanf("%d\n",&T);
	
	for(int i=0;i<T;i++){
		scanf("%[^\n]%*c",str);
		int j;
		for(j=0;j<strlen(str);j++){
			if (str[j] == 97 || str[j] == 105 || str[j] == 111 || str[j] == 101 || str[j] == 117 || str[j] == 65 || str[j] == 73 || str[j] == 85 || str[j] == 69 || str[j] == 79){
	
			}
			else {
			strx[i].str2[j]=str[j];
			}
		}
		printf("Case #%d: %s\n",i+1,strx[i].str2);

	}
	
	return(0);
}
