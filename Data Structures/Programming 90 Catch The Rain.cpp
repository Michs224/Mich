#include <stdio.h>
#include <stdlib.h>
#include <conio.h>
#include <string.h>

//I'm sorry is my program not completed Sorry I think the times is not enough 

char map[20][30];
char player='P';
int h=20,w=30;
int raindropcoll=0,raindroppass=0;
int x=18,y=15;

void generateMap(){
int rand;
	for(int i=0;i<h;i++){
		for(int j=0;j<w;j++){
			
			
//			for(int k=x;k<x+1;k++){
//			for(int l=x;l<=y;l++){
//				map[k][l]='#';
//			}break;
//			
//			}	

			
			if(j>0 && j<w-1){
				map[i][j]=' ';
				if(j%2==1 && i<h/2+5)map[i][j]='o';

			}
			else map[i][j]='#';
			
		}
		


	}
	map[x][y]=player;
}
void displayMap(){
//	char tamp[9]={NULL};
	map[x][y]=player;
	printf("\n");
	for(int i=0;i<h;i++){
		for(int j=0;j<w;j++){
			printf("%c",map[i][j]);
		}
		if(i<h-1) printf("\n");
	}
}


void moveUp(){
	if(x-1>=0 && x-1!='#'){
		if(map[x-1][y]=='o')raindropcoll++;
		map[x][y]=' ';
		x--;
	}
}
void moveDown(){
	if(x+1<h && x+1!='#'){
		if(map[x+1][y]=='o') raindropcoll++;
		map[x][y]=' ';
		x++;
		
	}
}
void moveLeft(){

	if(y-1>0 && y-1!='#'){
		if(map[x][y-1]=='o')raindropcoll++;
		map[x][y]=' ';
		y--;
	}
}

void moveRight(){
	if(y+1<w-1 && y+1!='#'){
	map[x][y]=' ';
		y++;
		if(map[x][y+1]=='o') raindropcoll++;
		
	}
}

int main(){
	int choose;
	do{
		system("cls");
		printf("CATCH THE RAINS\n");
		printf("1. Play\n2. Exit\n>> ");
		scanf("%d",&choose); 
		
		switch(choose){
			
			case 1:{
				generateMap();
				char continu='Y';
				do{
				system("cls");
				
				displayMap();
				printf(" Raindrops Collected: %d\n",raindropcoll);
				char raindropp[]="Raindrops Passes";
				printf(" %46s: %d\n",raindropp,raindroppass);
//				fflush(stdin);
				char move=getch();
				switch(move){
					case 'A':{ //Left
						moveLeft();
						break;
					}
					case 'W':{
						moveUp();
						break;
					}
					case 'S':{
						moveDown();
						break;
					}
						
					case 'B':{ //Right
						moveRight();
						break;
					}
					case 27:
						printf("Continue [Y/N]: "); continu=getch();
					 
				}
				}while(raindroppass!=50 && continu!='N');
				printf("\nYou Collected %d Rain Drops!\n",raindropcoll);
				system("pause");
				break;
		}
			case 2:
				break;
	}
	}while(choose!=2);
	printf("Thank You for Playing\n\n\n");
	printf("Wonderful things can be achieved when there is teamwork, hard work, and perseverance:)\n");
	return 0;
}
