#include <stdio.h>
#include <string.h>

int main(){
	int T,K;
	char ss[1000];
	FILE*badPrank =fopen("testdata.in","r");
	
	fscanf(badPrank,"%d",&T);
	for(int i=0;i<T;i++){
		fscanf(badPrank,"%d\n",&K);
		fscanf(badPrank,"%[^\n]",ss);
		for(int j=0;j<strlen(ss);j++){
			if(ss[j]=='0') ss[j]='O';
			if(ss[j]=='1') ss[j]='I';
			if(ss[j]=='3') ss[j]='E';
			if(ss[j]=='4') ss[j]='A'; 
			if(ss[j]=='5') ss[j]='S';
			if(ss[j]=='6') ss[j]='G';
			if(ss[j]=='7') ss[j]='T';
			if(ss[j]=='8') ss[j]='B'; 
			
			if(ss[j] >=65 && ss[j]<=90){
				if(ss[j]-K <65){
					ss[j]=ss[j]-K+26;
				}
				else ss[j]=ss[j]-K;
			}
			
			
		}
				
	
		printf("Case #%d: %s\n",i+1,ss);
	}
		fclose(badPrank);
	return 0;
}
