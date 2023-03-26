#include <stdio.h>
#include <string.h>

struct Mgw{
	char name[1001];
	int nilai;
};

int main(){
	int T,N;
	char ss[1001];
	struct Mgw mgw[1001];
	struct Mgw tukar;
	scanf("%d",&T);
	for(int i=0;i<T;i++){
		scanf("%d\n",&N);
		for(int j=0;j<N;j++){
			scanf("%[^\#]#%d\n",mgw[j].name,&mgw[j].nilai);
		}
		scanf("%s",ss);
		for(int i=0;i<N-1;i++){
			for(int j=N-1;j>i;j--){
				if(mgw[j-1].nilai < mgw[j].nilai){
					tukar=mgw[j-1];
					mgw[j-1]=mgw[j];
					mgw[j]=tukar;
				}
				if(mgw[j-1].nilai==mgw[j].nilai){
				if(strcmp(mgw[j-1].name,mgw[j].name)>0){
					tukar=mgw[j-1];
					mgw[j-1]=mgw[j];
					mgw[j]=tukar;
				}
			}
				
			}
		}

		int x;
		for(int x=0;x<N;x++){
			if(strcmp(ss,mgw[x].name)==0){
				printf("Case #%d: %d\n",i+1,x+1);
			}
		}
		
	}
	return 0;
}
