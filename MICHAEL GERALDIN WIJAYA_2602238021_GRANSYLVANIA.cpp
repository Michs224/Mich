#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <stdbool.h>
#include <string.h>
#include <ctype.h>
#include <windows.h> 
#include <conio.h>
#include <unistd.h>


//HOTEL GRANSYLVANIA

#define SIZE 100

struct sylvania{
	char ID[10];
	char names[35];
	char phones[30];
	char rooms[10];
	int ages;
	int nights;
	
	struct sylvania*next;
	
};

void cls(){
	COORD cursor;
	cursor.X=0;
	cursor.Y=0;
	SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE),cursor);
}

//Bisa juga hide pakai printf("\x1B[?25l");
void hideCursor(){
   HANDLE consoleHandle = GetStdHandle(STD_OUTPUT_HANDLE);
   CONSOLE_CURSOR_INFO info;
   info.dwSize = 10;
   info.bVisible = FALSE;
   SetConsoleCursorInfo(consoleHandle, &info);
}

//bisa juga show pakai printf("\x1B[?25h");
void showCursor(){
   HANDLE consoleHandle = GetStdHandle(STD_OUTPUT_HANDLE);
   CONSOLE_CURSOR_INFO info;
   info.dwSize = 10;
   info.bVisible = TRUE;
   SetConsoleCursorInfo(consoleHandle, &info);
}


void GranSylvania(int x){

	puts("");
	puts("\t\t\t\t\t  \033[31;6m+-----------------------------------+\033[0m");
	puts("\t\t\t\t\t  \033[31;6m|         \033[36;4;6mHotel GrAnsylvania\033[0m        \033[31;6m|\033[0m");		
	puts("\t\t\t\t\t  \033[31;6m+-----------------------------------+\033[0m\n\n");
	
	if(x==1){
	puts("\t\t\t\t\t\t    \033[31;6m1.\033[0m \033[31;47mBooking Hotel\033[0m");
	puts("\t\t\t\t\t\t    2. View Bookings");
	puts("\t\t\t\t\t\t    3. Delete Bookings");
	puts("\t\t\t\t\t\t    4. Delete All Bookings");
	puts("\t\t\t\t\t\t    5. Exit");
	}
	else if(x==2){
	puts("\t\t\t\t\t\t    1. Booking Hotel");
	puts("\t\t\t\t\t\t    \033[31;6m2.\033[0m \033[31;47mView Bookings\033[0m");
	puts("\t\t\t\t\t\t    3. Delete Bookings");
	puts("\t\t\t\t\t\t    4. Delete All Bookings");
	puts("\t\t\t\t\t\t    5. Exit");
	}
	else if(x==3){
	puts("\t\t\t\t\t\t    1. Booking Hotel");
	puts("\t\t\t\t\t\t    2. View Bookings");
	puts("\t\t\t\t\t\t    \033[31;6m3.\033[0m \033[31;47mDelete Bookings\033[0m");
	puts("\t\t\t\t\t\t    4. Delete All Bookings");
	puts("\t\t\t\t\t\t    5. Exit");
	}
	else if(x==4){
	puts("\t\t\t\t\t\t    1. Booking Hotel");
	puts("\t\t\t\t\t\t    2. View Bookings");
	puts("\t\t\t\t\t\t    3. Delete Bookings");
	puts("\t\t\t\t\t\t    \033[31;6m4.\033[0m \033[31;47mDelete All Bookings\033[0m");
	puts("\t\t\t\t\t\t    5. Exit");
	}
	else if(x==5){
	puts("\t\t\t\t\t\t    1. Booking Hotel");
	puts("\t\t\t\t\t\t    2. View Bookings");
	puts("\t\t\t\t\t\t    3. Delete Bookings");
	puts("\t\t\t\t\t\t    4. Delete All Bookings");
	puts("\t\t\t\t\t\t    \033[31;6m5.\033[0m \033[31;47mExit\033[0m");	
	}
	
	puts("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\t\033[31;6mArrow key [down | up] to move                                                            Enter to choose\033[0m");
	
}

void exitt(){
	system("cls");
	char exit[]="\n\t\t\t\t\tTHANK YOU FOR COMING TO HOTEL GRANSYLVANIA!\n\n\t\t\t\t\t                 EXIT";
	char exxit[]="....";
	for(int i=0;i<strlen(exit);i++){
		printf("\033[36;6m%c\033[0m",exit[i]);
		usleep(40000);
	}
	for(int i=0;i<strlen(exxit);i++){
		printf("\033[36;6m%c\033[0m",exxit[i]);
		sleep(1);
	}
	
}

void PressEnterToContinue(){
	hideCursor();
	char cont[]="\t\t\t  Press ENTER to continue...";
	for(int i=0;i<strlen(cont);i++){
		printf("%c",cont[i]);
		usleep(35000);
	}
	showCursor();
	getchar();
}

void SuccessBooking(){
	hideCursor();
	char success[]="\n\t\t\t\t\t     BOOKING HAS BEEN SUCCESSFUL!";
	for(int i=0;i<strlen(success);i++){
		printf("\033[36;6m%c\033[0m",success[i]);
		usleep(40000);
	}
}

bool check62(char phone[]){
	if(phone[0]=='+' && phone[1]=='6' && phone[2]=='2') return true;
	else return false;
}

bool checkSpaceandDigit(char phone[]){
	int	i=4,a=0,b=0;
	if(phone[3]==' ')a++;
	while(phone[i]!=NULL){
		if(phone[i]==' ')a++;
		if(isdigit(phone[i]))b++;
//		printf("%d %d\n",i,a);
		i++;
	}

	if(a==1 && b==11)return true;
	else return false;
}

bool checkRoomType(char roomtype[]){
	char room[][100]={"Regular",
					  "Deluxe",
					  "Suite"};
	int i=0,check=0;
	while(room[i][0]!=NULL){
		if(strcmp(roomtype,room[i])==0){
			check=1;
			break;
		}
		i++;
	}
	if(check==1)return true;
	else return false;
}

int hashkey(char Id[]){
	int key=0;
	for(int i=2;i<5;i++){
		key+=Id[i]-48;
	}
	if(key==0)return key;
	else return (key-1)%SIZE;
}

struct sylvania*Insert(sylvania*hasttable[],char Id[],char name[],char PhoneNumber[],int agee,char roomtype[],int night,int key){
	struct sylvania*book=(struct sylvania*)malloc(sizeof(struct sylvania));
	struct sylvania*last=(struct sylvania*)malloc(sizeof(struct sylvania));
	last=hasttable[key];
	
	strcpy(book->ID,Id),strcpy(book->names,name);
	strcpy(book->phones,PhoneNumber),strcpy(book->rooms,roomtype);
	book->ages=agee;book->nights=night;
	book->next=NULL;
	
	if(hasttable[key]==NULL){
		hasttable[key]=book;
	}
	else{
		while(last->next!=NULL){
			last=last->next;
		}
		last->next=book;
		
	}
	
	return hasttable[key];
	
}

struct sylvania*Booking(sylvania *hasttable[]){
	char name[35];
		printf("\n\t\t\t   Input Full Name [3..30] : ");
	do{
	fgets(name,sizeof(name),stdin);
	name[strcspn(name,"\n")]='\0';
//	printf("%s",name);
//	system("pause");
	fflush(stdin);
	
		if(strlen(name)<3 || strlen(name)>30){
		system("cls");
		printf("\n\t\t\t   Input Full Name [3..30] : ");
		printf("\n\n\n\t\t\t   \033[37;4;2mFULL NAME LENGTH MUST BETWEEN 3 AND 30\033[0m\033[2;54H");
		}		
	}while(strlen(name)<3 || strlen(name)>30);
	
	system("cls");
	printf("\n\t\t\t   Input Full Name [3..30] : %s",name);
	printf("\n\t\t\t   Input Phone Number\t   : ");
	char PhoneNumber[30];
	do{
		fgets(PhoneNumber,sizeof(PhoneNumber),stdin);
		PhoneNumber[strcspn(PhoneNumber, "\n")] = '\0';
//		printf("%s",PhoneNumber);
//		system("pause");
		fflush(stdin);
		if(!check62(PhoneNumber) || !checkSpaceandDigit(PhoneNumber)){
		system("cls");
		printf("\n\t\t\t   Input Full Name [3..30] : %s",name);
		printf("\n\t\t\t   Input Phone Number\t   : ");
		printf("\n\n\n\t\t\t   \033[37;4;2mPHONE NUMBER MUST BEGIN WITH '+62', CONTAINS WITH AT LEAST 1 SPACE AND\n\t\t\t\033[0m   \033[37;4;2mTHE LENGTH MUST BE 11 (EXCLUDE +62 AND SPACE)\033[0m\033[3;54H");
		}
	}while(!check62(PhoneNumber) || strlen(PhoneNumber)!=15 || !checkSpaceandDigit(PhoneNumber));
	
	system("cls");
	printf("\n\t\t\t   Input Full Name [3..30] : %s",name);
	printf("\n\t\t\t   Input Phone Number\t   : %s",PhoneNumber);
	printf("\n\t\t\t   Input Age [Minimum 18]  : ");
	int agee;
	do{
		scanf("%d",&agee);
		fflush(stdin);
		if(agee<18){
			system("cls");
			printf("\n\t\t\t   Input Full Name [3..30] : %s",name);
			printf("\n\t\t\t   Input Phone Number\t   : %s",PhoneNumber);
			printf("\n\t\t\t   Input Age [Minimum 18]  : ");
			printf("\n\n\n\t\t\t   \033[37;4;2mAGE MUST BE MINIMUM 18\033[0m\033[4;54H");	
		}
		
	}while(agee<18);
	
	system("cls");
	printf("\n\t\t\t   Input Full Name [3..30] : %s",name);
	printf("\n\t\t\t   Input Phone Number\t   : %s",PhoneNumber);
	printf("\n\t\t\t   Input Age [Minimum 18]  : %d",agee);
	printf("\n\t\t\t   Input Room Type [Regular | Deluxe | Suite] (Case Sensitive) : ");
	
	char roomtype[10];
	do{
		fgets(roomtype,sizeof(roomtype),stdin);
		roomtype[strcspn(roomtype,"\n")]='\0';
		fflush(stdin);
		if(!checkRoomType(roomtype)){
			system("cls");
			printf("\n\t\t\t   Input Full Name [3..30] : %s",name);
			printf("\n\t\t\t   Input Phone Number\t   : %s",PhoneNumber);
			printf("\n\t\t\t   Input Age [Minimum 18]  : %d",agee);
			printf("\n\t\t\t   Input Room Type [Regular | Deluxe | Suite] (Case Sensitive) : ");
			printf("\n\n\n\t\t\t   \033[37;4;2mROOM TYPE MUST BE EITHER 'Regular' or 'Deluxe' or 'Suite' (CASE SENSITIVE)\033[0m\033[5;90H");
		}
	}while(!checkRoomType(roomtype));
	
	system("cls");
	printf("\n\t\t\t   Input Full Name [3..30] : %s",name);
	printf("\n\t\t\t   Input Phone Number\t   : %s",PhoneNumber);
	printf("\n\t\t\t   Input Age [Minimum 18]  : %d",agee);
	printf("\n\t\t\t   Input Room Type [Regular | Deluxe | Suite] (Case Sensitive) : %s",roomtype);
	printf("\n\t\t\t   Input How Many Night You Will Stay [1..30] : ");
	
	int night;
	do{
		scanf("%d",&night);
		fflush(stdin);
		if(night<1 || night>30){
			system("cls");
			printf("\n\t\t\t   Input Full Name [3..30] : %s",name);
			printf("\n\t\t\t   Input Phone Number\t   : %s",PhoneNumber);
			printf("\n\t\t\t   Input Age [Minimum 18]  : %d",agee);
			printf("\n\t\t\t   Input Room Type [Regular | Deluxe | Suite] (Case Sensitive) : %s",roomtype);
			printf("\n\t\t\t   Input How Many Night You Will Stay [1..30] : ");
			printf("\n\n\n\t\t\t   \033[37;4;2mYOU CAN'T STAY LESS THAN 1 NIGHT OR MORE THAN 30 NIGHT\033[0m\033[6;73H");
		}
	}while(night<1 || night>30);

	char Id[10]={NULL};
	
	for(int i=0;i<2;i++){
		Id[i]=toupper(roomtype[i]);
	}
	for(int i=0;i<3;i++){
		int x=rand()%10;
		char num[2]={NULL};
		itoa(x,num,10);
		if(i==2 && Id[0]=='0' && Id[1]=='0'){
			if(num[0]=='0')num[0]='1';
		}
		strcat(Id,num);
	}
//	printf("%s\n",Id);

	int key=hashkey(Id);
//	printf("%d\n",key);
	hasttable[key]=Insert(hasttable,Id,name,PhoneNumber,agee,roomtype,night,key);
	
	system("cls");
	hideCursor();
	SuccessBooking();
	char night_s[]="night(s)";
	printf("\n\t\t\t\t  +=================================================+");usleep(80000);
	printf("\n\t\t\t\t  | Booking ID     : %-30s |",Id);usleep(80000);
	printf("\n\t\t\t\t  +=================================================+");usleep(80000);
	printf("\n\t\t\t\t  | Full Name      : %-30s |",name);usleep(80000);
	printf("\n\t\t\t\t  | Phone Number   : %-30s |",PhoneNumber);usleep(80000);
	printf("\n\t\t\t\t  | Room Type      : %-30s |",roomtype);usleep(80000);
	if(night<10){
	printf("\n\t\t\t\t  | Night Stay     : %d %-28s |",night,night_s);usleep(80000);	
	}
	else
	printf("\n\t\t\t\t  | Night Stay     : %d %-28s|",night,night_s);usleep(80000);
	printf("\n\t\t\t\t  +=================================================+\n\n");usleep(80000);

	
	printf("\t");PressEnterToContinue();
	return *hasttable;
}

bool isEmpty(sylvania*hasttable[]){
	int empty=0;
	for(int i=0;i<100;i++){
		if(hasttable[i]!=NULL)empty++;
	}
	if(empty==0)return true;
	else return false;
}

int tanda;
void ViewBookings(sylvania*hasttable[]){
	struct sylvania*temp=(struct sylvania*)malloc(sizeof(struct sylvania));
	hideCursor();
	
	if(isEmpty(hasttable)){
		printf("\n\t\t\t\t\t      +-----------------------+");usleep(80000);
		printf("\n\t\t\t\t\t      | There is no booking ! |");usleep(80000);
		printf("\n\t\t\t\t\t      +-----------------------+\n");usleep(80000);
		printf("\n\t                ");PressEnterToContinue();
		tanda=0;
	}
	
	else{
	tanda=1;
	char night_s[]="night(s)";
			printf("\n\t\t\t\t                    \033[33;4;2mALL BOOKING DATA\033[0m\n");usleep(80000);
	for(int i=0;i<100;i++){
		temp=hasttable[i];
		if(temp==NULL)continue;
		while(temp!=NULL){
			printf("\n\t\t\t\t  +=================================================+");usleep(80000);
			printf("\n\t\t\t\t  | Booking ID     : %-30s |",temp->ID);usleep(80000);
			printf("\n\t\t\t\t  +=================================================+");usleep(80000);
			printf("\n\t\t\t\t  | Full Name      : %-30s |",temp->names);usleep(80000);
			printf("\n\t\t\t\t  | Phone Number   : %-30s |",temp->phones);usleep(80000);
			printf("\n\t\t\t\t  | Room Type      : %-30s |",temp->rooms);usleep(80000);
			if(temp->nights<10){
			printf("\n\t\t\t\t  | Night Stay     : %d %-28s |",temp->nights,night_s);usleep(80000);				
			}
			else
			printf("\n\t\t\t\t  | Night Stay     : %d %-28s|",temp->nights,night_s);usleep(80000);
			printf("\n\t\t\t\t  +=================================================+\n");usleep(80000);
			temp=temp->next;
		}		
	}
//		printf("\n\t");PressEnterToContinue();	
	}
	
}

struct sylvania*DeleteBookings(sylvania*hasttable[]){
	struct sylvania*temp=(struct sylvania*)malloc(sizeof(struct sylvania));
	hideCursor();
	int check;
	char ID[10]={NULL},Name[35]={NULL},Phone[30]={NULL};
	if(isEmpty(hasttable)){
		system("cls");
		printf("\n\t\t\t\t\t      +-----------------------+");usleep(80000);
		printf("\n\t\t\t\t\t      | There is no booking ! |");usleep(80000);
		printf("\n\t\t\t\t\t      +-----------------------+\n");usleep(80000);
		printf("\n\t                ");PressEnterToContinue();
		return *hasttable;
	}
	else{	
		ViewBookings(hasttable);showCursor();
		do{
			printf("\n\t\t\t\t  Input Booking ID (Case Sensitive) [Must be 5 Characters]: "); 
			fgets(ID,sizeof(ID),stdin);
			ID[strcspn(ID,"\n")]='\0';
			fflush(stdin);
		}while(strlen(ID)!=5);
		
		do{
			printf("\t\t\t\t  Input Full Name [3..30] : ");
			fgets(Name,sizeof(Name),stdin);
			Name[strcspn(Name,"\n")]='\0';
			fflush(stdin);
		}while(strlen(Name)<3 || strlen(Name)>30);
		
		do{
			printf("\t\t\t\t  Input Phone Number\t  : ");
			fgets(Phone,sizeof(Phone),stdin);
			Phone[strcspn(Phone,"\n")]='\0';
			fflush(stdin);
		}while(!check62(Phone) || strlen(Phone)!=15 || !checkSpaceandDigit(Phone));
		
		
//		ID[strcspn(ID,"\n")]='\0';
		
		int keycheck=hashkey(ID);
		if(hasttable[keycheck]==NULL){
		check=0;
		}
		else{
			temp=hasttable[keycheck];
			if(strcmp(ID,temp->ID)==0){
				if(strcmp(Name,temp->names)==0){
					if(strcmp(Phone,temp->phones)==0){
						temp=temp->next;
						hasttable[keycheck]=temp;
						check=1;							
					}
				}
			}
			else{
				struct sylvania*pre=(struct sylvania*)malloc(sizeof(struct sylvania));
				while(temp->next!=NULL && strcmp(ID,temp->ID)!=0){
					pre=temp;
					temp=temp->next;
				}
				if(temp->next==NULL && strcmp(ID,temp->ID)==0){
					if(strcmp(Name,temp->names)==0){
						if(strcmp(Phone,temp->phones)==0){
							pre->next=NULL;
							check=1;							
						}
					}

				}
				else if(temp->next!=NULL && strcmp(ID,temp->ID)==0){
					if(strcmp(Name,temp->names)==0){
						if(strcmp(Phone,temp->phones)==0){
							pre->next=temp->next;
							check=1;							
						}
					}
				}
				else{
					check=0;
				}
			}
			keycheck++;	
		}
	}
	
	system("cls");
	if(check==1){
		printf("\n\t\t\t\t  +-------------------------------------------+");usleep(80000);
		printf("\n\t\t\t\t  | BookingID %s is Successfully Deleted ! |",ID);usleep(80000);
		printf("\n\t\t\t\t  +-------------------------------------------+\n");usleep(80000);
		printf("\n\t     ");PressEnterToContinue();
	}
	else{
		printf("\n\t\t\t\t     +--------------------------------------+");usleep(80000);
		printf("\n\t\t\t\t     | Failed to Delete, There is No Data ! |");usleep(80000);
		printf("\n\t\t\t\t     +--------------------------------------+\n");usleep(80000);
		printf("\n\t         ");PressEnterToContinue();
	}
	
	return *hasttable;
	
}

struct sylvania*DeleteAll(sylvania*hasttable[]){
	struct sylvania*temp;
	struct sylvania*tamp;
	for(int i=0;i<100;i++){
		tamp=hasttable[i];
		while(tamp!=NULL){
		temp=tamp;
		tamp=tamp->next;
		free(temp);
	}
	hasttable[i]=NULL;		
	}
	
	printf("\n\t\t\t\t  +-------------------------------------------+");usleep(80000);
	printf("\n\t\t\t\t  | All BookingID  is Successfully Deleted !  |");usleep(80000);
	printf("\n\t\t\t\t  +-------------------------------------------+\n");usleep(80000);		
	printf("\n\t     ");PressEnterToContinue();
	
	return *hasttable;
	
}

int main(){
	srand(time(0));
	sylvania*hasttable[100]={NULL};
	srand(time(0));
	int select=1;
	system("cls");
	hideCursor();
		do{
			cls();
			switch(select){
				case 1:{
					GranSylvania(1);
					break;
				}
				case 2:{
					GranSylvania(2);
					break;
				}
				case 3:{
					GranSylvania(3);
					break;
				}
				case 4:{
					GranSylvania(4);	
					break;
				}
				case 5:{
					GranSylvania(5);
					break;
				}
			}
//			printf("%d\n",select);

			char move=getch();
			if(move==72){
				if(select>1 && select<=5)
				select--;
			}
			else if(move==80){
				if(select>=1 && select<5)
				select++;
//				printf("%d\n",select);
			}
			else if(move=='\r'){
			switch(select){
			case 1:{
//				printf("\x1B[?25h");
				showCursor();
				system("cls");
				*hasttable=Booking(hasttable);
				system("cls");
				hideCursor();
				break;
			}
			
			case 2:{
				showCursor();
				system("cls");
				ViewBookings(hasttable);
				if(tanda==1){
				printf("\n\t");PressEnterToContinue();	
				}
				system("cls");
				hideCursor();
				break;
			}
			
			case 3:{
				showCursor();
				system("cls");
				*hasttable=DeleteBookings(hasttable);
				system("cls");
				hideCursor();
				break;
						
			}
			case 4:{
				showCursor();
				system("cls");
				*hasttable=DeleteAll(hasttable);
				system("cls");
				hideCursor();
				break;
			}
			case 5:{
				hideCursor();
				exitt();
				select=6;
				break;
			}
			
		}
		
		}
				
		}while(select!=6);

	
	return 0;
}
