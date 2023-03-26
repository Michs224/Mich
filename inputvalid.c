#include <stdio.h>
#include <math.h>

int main (){
	int choice;
	for(;;){
		printf("Pilih anime untuk ditonton di bawah ini dengan menginput berdasarkan kode angkanya:\nOne Piece\t\t\t>> 11\nHunterXHunter\t\t\t>> 12\nDragon Ball Super\t\t>> 13\nBoruto: Naruto next generations\t>> 21\nDr. STONE\t\t\t>> 22\nOne Punch Man\t\t\t>> 23\n\nHANYA TERSEDIA ANIME TERSEBUT UNTUK SAAT INI.\n");
		scanf("%d",&choice);
		if (choice==11 || choice==12 || choice==13 || choice==21 || choice==22 || choice==23){
			printf("Silahkan menonton!");
			break;
			
		}
		else printf("\nAnda menginput kode anime yang salah. Silahkan menginput ulang!\n\n");
	}


	
	return(0);
}
