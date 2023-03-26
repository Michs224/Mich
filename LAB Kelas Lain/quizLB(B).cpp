#include <stdio.h>
#include <string.h>


struct mhs{
	char hero[101];
	int dmg;
};

void asc(mhs data[],int t){
	mhs tukar;
		for(int i=0;i<t;i++){
		for(int j=t-1;j>i;j--){
			if(data[j-1].dmg > data[j].dmg){
				tukar=data[j];
				data[j]=data[j-1];
				data[j-1]=tukar;
			}
			if(data[j-1].dmg == data[j].dmg){
			
			if(strcmp(data[j-1].hero,data[j].hero) > 0){
				tukar=data[j];
				data[j]=data[j-1];
				data[j-1]=tukar;
			}
		}
		}
	}
	
}

void dsc(mhs data[], int t){
	mhs tukar;
		for(int i=0;i<t;i++){
		for(int j=t-1;j>i;j--){
			if(data[j-1].dmg < data[j].dmg){
				tukar=data[j];
				data[j]=data[j-1];
				data[j-1]=tukar;
			}
			if(data[j-1].dmg == data[j].dmg){
			
			if(strcmp(data[j-1].hero,data[j].hero)<0){
				tukar=data[j];
				data[j]=data[j-1];
				data[j-1]=tukar;
			}
		}
		}
	}
}


int main(){
	int T;
	mhs data[1001];
	mhs tukar;
	scanf("%d",&T);
	for(int i=0;i<T;i++){
		scanf("%s %d\n",data[i].hero, &data[i].dmg);
	}
	char x[3];

	scanf("%s",x);
	if(strcmp("asc",x)==0){
		asc(data,T);
//	for(int i=0;i<T;i++){
//		for(int j=T-1;j>i;j--){
//			if(data[j-1].dmg > data[j].dmg){
//				tukar=data[j];
//				data[j]=data[j-1];
//				data[j-1]=tukar;
//			}
//			if(data[j-1].dmg == data[j].dmg){
//			
//			if(strcmp(data[j-1].hero,data[j].hero) == 0){
//				tukar=data[j];
//				data[j]=data[j-1];
//				data[j-1]=tukar;
//			}
//		}
//		}
//	}
	}
	else if(strcmp("dsc",x)==0){
		dsc(data,T);
//	for(int i=0;i<T;i++){
//		for(int j=T-1;j>i;j--){
//			if(data[j-1].dmg < data[j].dmg){
//				tukar=data[j];
//				data[j]=data[j-1];
//				data[j-1]=tukar;
//			}
//			if(data[j-1].dmg == data[j].dmg){
//			
//			if(strcmp(data[j-1].hero,data[j].hero)<0){
//				tukar=data[j];
//				data[j]=data[j-1];
//				data[j-1]=tukar;
//			}
//		}
//		}
//	}
	}
	
	for(int i=0;i<T;i++){
		printf("%s %d\n",data[i].hero,data[i].dmg);
	}
}
