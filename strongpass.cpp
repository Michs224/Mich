#include <stdio.h>
#include <string.h>

int main(){
	char ss[100];
	scanf("%[^\n]",ss);
	
	int count=1,count1=0,count2=0;
	
	for(int i=0;i<strlen(ss);i++){
		if(ss[i]>=65 && ss[i]<=97){
			count1=1;
		}
		if(ss[i]=='!' || ss[i]=='@' || ss[i]=='#' || ss[i]=='$' || ss[i]=='%' || ss[i]=='^' || ss[i]=='&' || ss[i]=='*' || ss[i]=='(' || ss[i]==')' || ss[i]=='-' || ss[i]=='+'){
		count2=1;			
		}
		
		}
		int countt;
		countt=count+count1+count2;
		
		if(countt<2){
			printf("weak password\n");
		}
		else if (countt==2){
			printf("medium password\n");
		}
		else if(countt>2){
			printf("strong password\n");
		}
		
		return(0);
	}
