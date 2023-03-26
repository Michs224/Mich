#include <stdio.h>

int main(){
	
	
	struct musik{
		int jml;
		char nama[101];
		int harga;
	};
	
	FILE *data = fopen("testdata.in", "r");
	int tsc;
	fscanf(data, "%d",&tsc);
	
	for(int i=0;i<tsc;i++){
		int tsc2;
		fscanf(data,"%d",&tsc2);
		struct musik music[tsc2];
		for(int j=0;j<tsc2;j++){
			fscanf(data,"%d#%[^\@]@%d\n",&music[j].jml,&music[j].nama,&music[j].harga);
//			printf("%d %s %d\n",music[j].jml,music[j].nama,music[j].harga);
		}
		
		int total=0,discount=0,a=0;
		for(int j=0;j<tsc2;j++){
			a = music[j].jml * music[j].harga;
			total += a;
			a=0;
		}
		discount = total * 0.15;
		printf("customer #%d : %d\n",i+1,total - discount);
	}
	fclose(data);
	return 0;
}
