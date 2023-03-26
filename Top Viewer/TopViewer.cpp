#include <stdio.h>
#include <string.h>

struct data{
	char title[1001];
	char artist[1001];
	int view;
};

int main(){
	struct data luffy[1001];
	struct data zoro;
	FILE*gomuGomu =fopen("testdata.in","r");
	int i=0;
	while(!feof(gomuGomu)){
		fscanf(gomuGomu,"%[^\#]#%[^\#]#%d\n",luffy[i].title,luffy[i].artist,&luffy[i].view);
		i++;
		
	}
	int count=i;
	for(int i=0;i<count;i++){
		for(int j=count-1;j>i;j--){
				if(luffy[j-1].view < luffy[j].view){
					zoro=luffy[j-1];
					luffy[j-1]=luffy[j];
					luffy[j]=zoro;
				}
				if(luffy[j-1].view==luffy[j].view){
				if(strcmp(luffy[j-1].title,luffy[j].title)>0){
					zoro=luffy[j-1];
					luffy[j-1]=luffy[j];
					luffy[j]=zoro;
				}
			}
		}
	}
	
	for(int i=0;i<count;i++){
		printf("%s by %s - %d\n",luffy[i].title,luffy[i].artist,luffy[i].view);
	}
	
}
